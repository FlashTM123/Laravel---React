<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users; // ✅ Đổi từ 'Users' thành 'User'
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    /**
     * Display the users management page (for web)
     */
    public function index()
    {
        try {
            // ✅ Đổi từ Users::select thành Users::select
            $users = Users::select('id', 'name', 'email', 'phone', 'address', 'role', 'status', 'created_at', 'updated_at')
                ->orderBy('id', 'desc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone ?? 'Chưa có',
                        'address' => $user->address ?? 'Chưa có',
                        'role' => $user->role ?? 'user',
                        'status' => $user->status ?? 'active',
                    ];
                });

            // ✅ Đổi từ Users::count() thành User::count()
            $stats = [
                'total_users' => Users::count(),
                'active_users' => Users::where('status', 'active')->count(),
                'inactive_users' => Users::where('status', 'inactive')->count(),
                'new_users_this_month' => Users::whereMonth('created_at', now()->month)->count(),
            ];

        } catch (\Exception $e) {
                        // Fallback data nếu database lỗi
            
        }

        return view('admins.users.index', compact('users', 'stats'));
    }

    /**
     * Show form to create new user
     */
    public function create()
    {
        return view('admins.users.create');
    }

    /**
     * Store new user
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|max:150|unique:user,email', // ✅ Bảng 'user'
                'password' => 'required|string|min:6|confirmed',
                'phone' => 'nullable|string|max:15',
                'address' => 'nullable|string|max:255',
                'role' => 'nullable|in:admin,user,moderator',
            ]);

            $validated['password'] = Hash::make($validated['password']);
            $validated['role'] = $validated['role'] ?? 'user';
            $validated['status'] = 'active'; // Mặc định là đang hoạt động

            // ✅ Đổi từ Users::create thành User::create
            $user = Users::create($validated);

            return redirect()->route('users.index')
                ->with('success', 'Tạo người dùng mới thành công!');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        try {
            $user = Users::findOrFail($id);
            return view('admins.users.show', compact('user'));
        } catch (\Exception $e) {
            return redirect()->route('users.index')
                ->withErrors(['error' => 'Không tìm thấy người dùng!']);
        }
    }

    /**
     * Show the form for editing the specified user
     */
    public function edit($id)
    {
        try {
            $user = Users::findOrFail($id);
            return view('admins.users.edit', compact('user'));
        } catch (\Exception $e) {
            return redirect()->route('users.index')
                ->withErrors(['error' => 'Không tìm thấy người dùng!']);
        }
    }

    /**
     * Update the specified user in storage
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Users::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|max:150|unique:user,email,' . $id,
                'password' => 'nullable|string|min:6|confirmed',
                'phone' => 'nullable|string|max:15',
                'address' => 'nullable|string|max:255',
                'role' => 'nullable|in:admin,user,moderator',
                'status' => 'required|in:active,inactive',
            ]);

            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $user->update($validated);

            return redirect()->route('users.index')
                ->with('success', 'Cập nhật người dùng thành công!');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified user from storage
     */
    public function destroy($id)
    {
        try {
            $user = Users::findOrFail($id);
            $user->delete();

            return redirect()->route('users.index')
                ->with('success', 'Xóa người dùng thành công!');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete user (alias for destroy method)
     */
    public function delete($id)
    {
        return $this->destroy($id);
    }

    /**
     * Display the login page
     */
    public function login()
    {
        return view('auth.login');
    }
}
