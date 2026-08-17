<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            if (Auth::user()->isEmployee()) {
                return redirect()->route('mobile.dashboard');
            }
            return redirect()->route('admin.dashboard');
        }
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            if ($user->isEmployee()) {
                return redirect()->intended(route('mobile.dashboard'));
            }
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Email atau kata sandi tidak valid.',
        ])->onlyInput('email');
    }

    public function quickLogin($role)
    {
        $emailMap = [
            'admin' => 'admin@enterprise.com',
            'hr' => 'hr@enterprise.com',
            'manager' => 'manager@enterprise.com',
            'finance' => 'finance@enterprise.com',
            'supervisor' => 'supervisor@enterprise.com',
            'employee' => 'budi@enterprise.com',
            'designer' => 'siti@enterprise.com',
        ];

        if (isset($emailMap[$role])) {
            $user = User::where('email', $emailMap[$role])->first();
            if ($user) {
                Auth::login($user);
                request()->session()->regenerate();
                
                if ($user->isEmployee()) {
                    return redirect()->route('mobile.dashboard')->with('success', "Selamat datang kembali, {$user->name}!");
                }
                return redirect()->route('admin.dashboard')->with('success', "Login sebagai {$user->name} ({$user->role}) berhasil.");
            }
        }

        return redirect()->route('login');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Anda telah berhasil logout.');
    }
}
