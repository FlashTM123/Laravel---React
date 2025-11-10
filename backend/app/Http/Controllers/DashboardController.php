<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Users;
use App\Models\Category;
use App\Models\Brand;

class DashboardController extends Controller
{
    public function index()
    {
        // Collect statistics data
        $dashboardData = [
            'total_users' => Users::count(),
            'total_categories' => Category::count(),
            'total_brands' => Brand::count(),
            'total_customers' => Users::where('role', 'customer')->count(),
            'active_users' => Users::where('status', 'active')->count(),
            'recent_signups' => Users::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        return view('admins.dashboard.index', compact('dashboardData'));
    }
}
