<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RolesPermission\RoleAndPermissionStoreRequest;
use App\Http\Resources\RolesPermissions\RoleResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    public function getRoles(): JsonResponse
    {
        $roles = Role::with("permissions")
            ->withCount([
                "users as users_count" => fn($q) => $q->where(
                    "model_has_roles.model_type",
                    new \App\Models\User()->getMorphClass(),
                ),
            ])
            ->get();

        return response()->json(RoleResource::collection($roles));
    }

    public function assignRole(User $user, Request $request)
    {
        $request->validate([
            "role" => "required|string",
        ]);
        $role = Role::where("name", $request->role)->first();
        if (!$role) {
            return response()->json(["message" => "Role not found"], 404);
        }
        $user->assignRole($role);

        return response()->json(["message" => "Role assigned successfully"]);
    }

    public function assignPermissionToRole(
        RoleAndPermissionStoreRequest $request,
    ) {
        $validated = $request->validated();
        $role = Role::create([
            "name" => $validated["name"],
            "guard_name" => "web",
        ]);

        $role->syncPermissions($validated["permissions"]);

        return response()->json(
            [
                "id" => $role->id,
                "name" => $role->name,
                "permissions" => $validated["permissions"],
            ],
            201,
        );
    }
}
