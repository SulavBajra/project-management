<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class RoleRepository
{
    public function getRolesWithUserCount()
    {
        return DB::table('roles')
            ->leftJoin(
                'model_has_roles',
                'roles.id',
                '=',
                'model_has_roles.role_id',
            )
            ->select(
                'roles.*',
                DB::raw('COUNT(model_has_roles.model_id) as users_count'),
            )
            ->groupBy('roles.id')
            ->get();
    }
}
