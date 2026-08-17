<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Task;

class TaskController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $employee = $user->employee;

        $tasks = Task::with('project')
            ->where('employee_id', $employee->id)
            ->orderByRaw("CASE 
                WHEN status = 'in_progress' THEN 1 
                WHEN status = 'todo' THEN 2 
                WHEN status = 'review' THEN 3 
                ELSE 4 END")
            ->orderBy('deadline', 'asc')
            ->get();

        return view('mobile.tasks', compact('user', 'employee', 'tasks'));
    }

    public function updateProgress(Request $request, $id)
    {
        $request->validate([
            'progress_percentage' => 'required|integer|min:0|max:100',
            'status' => 'nullable|in:todo,in_progress,review,completed',
        ]);

        $user = Auth::user();
        $employee = $user->employee;

        $task = Task::where('id', $id)->where('employee_id', $employee->id)->firstOrFail();

        $status = $request->status;
        if (!$status) {
            if ($request->progress_percentage == 100) {
                $status = 'completed';
            } elseif ($request->progress_percentage > 0) {
                $status = 'in_progress';
            } else {
                $status = 'todo';
            }
        }

        $task->update([
            'progress_percentage' => $request->progress_percentage,
            'status' => $status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Progress tugas berhasil diperbarui!',
            'data' => $task
        ]);
    }

    public function startTask($id)
    {
        $user = Auth::user();
        $employee = $user->employee;

        $task = Task::where('id', $id)->where('employee_id', $employee->id)->firstOrFail();
        $task->update([
            'status' => 'in_progress',
            'progress_percentage' => max($task->progress_percentage, 10),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pekerjaan tugas dimulai!',
            'data' => $task
        ]);
    }

    public function completeTask($id)
    {
        $user = Auth::user();
        $employee = $user->employee;

        $task = Task::where('id', $id)->where('employee_id', $employee->id)->firstOrFail();
        $task->update([
            'status' => 'completed',
            'progress_percentage' => 100,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tugas selesai!',
            'data' => $task
        ]);
    }
}
