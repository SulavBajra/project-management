<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    public function getRoles()
    {
        $roles = Role::all()->pluck('name');

        return response()->json($roles);
    }

    public function assignRole(User $user, Request $request)
    {
        $request->validate([
            'role' => 'required|string',
        ]);
        $role = Role::where('name', $request->role)->first();
        if (! $role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
        $user->assignRole($role);

        return response()->json(['message' => 'Role assigned successfully']);
    }
}
