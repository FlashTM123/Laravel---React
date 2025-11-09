<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>@yield('title')</title>
  <!-- Make header and sidebar fixed on scroll. We use CSS variables so React components can override sizes if needed -->
  <style>
    :root{
      --header-height: 4rem; /* override in React/CSS if different */
      --sidebar-width: 16rem; /* default sidebar width (w-64) */
    }
    /* Header / navbar - fixed to top */
    #header-root{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--header-height);
      z-index: 50;
      background: transparent; /* React will render its own background; keep transparent by default */
    }
    /* Sidebar - fixed under the header, fills height */
    #sidebar-root{
      position: fixed;
      top: var(--header-height);
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      z-index: 40;
      overflow: auto;
      background: transparent; /* React will render its own background */
    }
    /* Main content must be offset so it doesn't go under the header/sidebar */
    main#app{
      margin-top: var(--header-height);
      margin-left: var(--sidebar-width);
      min-height: calc(100vh - var(--header-height));
    }
    /* Responsive: on small screens, let sidebar collapse by setting width to 0 if a small-screen class is applied by React */
    @media (max-width: 768px){
      :root{ --sidebar-width: 0; }
      #sidebar-root{ position: fixed; visibility: visible; }
      main#app{ margin-left: 0; }
    }
  </style>
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
