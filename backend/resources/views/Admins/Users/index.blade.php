@extends('admins.app')
@section('title', 'Quản lý người dùng')
@section('content')

    @if (session('success'))
        <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex">
                <div class="shrink-0">
                    <span class="text-green-400 text-xl">✅</span>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">
                        {{ session('success') }}
                    </p>
                </div>
            </div>
        </div>
    @endif

    @if ($errors->any())
        <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
                <div class="shrink-0">
                    <span class="text-red-400 text-xl">⚠️</span>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                        Có lỗi xảy ra:
                    </h3>
                    <div class="mt-2 text-sm text-red-700">
                        <ul class="list-disc list-inside space-y-1">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <div
        data-table-type="users"
        data-initial-data="{{ json_encode($users) }}"
        data-stats-data="{{ json_encode($stats) }}"
        id="users-table-container"
    ></div>
@endsection
