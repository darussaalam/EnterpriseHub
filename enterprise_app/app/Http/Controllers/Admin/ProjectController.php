<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Task;
use App\Models\Employee;
use App\Models\User;
use App\Models\Notification;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['manager', 'tasks.employee'])
            ->withCount(['tasks'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $employees = Employee::where('status', 'active')->get();
        $managers = User::whereIn('role', ['admin', 'manager', 'supervisor'])->get();

        return view('admin.projects.index', compact('projects', 'employees', 'managers'));
    }

    public function storeProject(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:projects,code|max:50',
            'client_name' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'required|numeric|min:0',
            'status' => 'required|in:planning,in_progress,completed,on_hold',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        Project::create($request->all());

        return redirect()->route('admin.projects')->with('success', 'Project baru berhasil dibuat!');
    }

    public function show($id)
    {
        $project = Project::with(['manager', 'tasks.employee.user'])->findOrFail($id);
        $employees = Employee::where('status', 'active')->get();

        return view('admin.projects.show', compact('project', 'employees'));
    }

    public function storeTask(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'employee_id' => 'required|exists:employees,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'deadline' => 'nullable|date',
        ]);

        $task = Task::create([
            'project_id' => $request->project_id,
            'employee_id' => $request->employee_id,
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'deadline' => $request->deadline,
            'progress_percentage' => 0,
            'status' => 'todo',
        ]);

        // Send notification to assigned employee
        $employee = Employee::with('user')->find($request->employee_id);
        if ($employee && $employee->user) {
            Notification::create([
                'user_id' => $employee->user->id,
                'title' => 'Tugas Baru Diberikan: ' . $request->title,
                'message' => "Anda telah ditugaskan untuk tugas '{$request->title}'. Batas waktu: " . ($request->deadline ?? 'Belum ditentukan'),
                'type' => 'task',
                'link_url' => '/mobile/tasks',
            ]);
        }

        return back()->with('success', 'Tugas berhasil ditambahkan dan ditugaskan ke karyawan!');
    }

    public function updateTaskStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->update([
            'status' => $request->input('status', $task->status),
            'progress_percentage' => $request->input('progress_percentage', $task->progress_percentage),
        ]);

        return back()->with('success', 'Status tugas berhasil diperbarui.');
    }
}
