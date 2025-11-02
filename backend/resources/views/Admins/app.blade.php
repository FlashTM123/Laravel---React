<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>@yield('title')</title>
  @viteReactRefresh
  @vite(['resources/js/app.jsx', 'resources/css/app.css'])
</head>
<body class="min-h-screen font-sans antialiased">
  {{-- Header (React mounts here) --}}
  <div id="header-root"></div>

  <div class="flex">
    {{-- Sidebar (React mounts here) --}}
    <div id="sidebar-root"></div>

    {{-- Main content (Blade) --}}
    <main id="app" class="flex-1 bg-gray-50 min-h-screen">
      <div class="p-6 lg:p-8 max-w-7xl mx-auto">
        @yield('content')
      </div>
    </main>
  </div>

</body>
</html>
