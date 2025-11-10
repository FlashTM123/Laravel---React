@extends('admins.app')
@section('title', 'Dashboard Quản Lý')
@section('content')
    <div
        id="manage-dashboard-container"
        data-stats-data="{{ json_encode($dashboardData) }}"
    ></div>
@endsection
