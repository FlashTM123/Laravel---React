<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\Request;


class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();
        return view('admins.category.index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        // Validate (StoreCategoryRequest already handles validation when used from web forms)
        // But to support AJAX JSON, we'll validate here as a fallback.
        $data = $request->validated() ?? $request->only(['name', 'description']);

        // Create category
        $category = Category::create([
            'name' => $data['name'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        
        // If the client expects JSON (AJAX/modal), return JSON; otherwise redirect back with a success message
        if ($request->wantsJson() || $request->ajax() || str_contains($request->header('Accept', ''), 'application/json')) {
            return response()->json($category, 201);
        }
       flash()
            ->options(['position' => 'bottom-right'])
            ->use('theme.facebook')
            ->success('Your product has been created successfully!');

        return redirect()->route('categories.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $data = $request->validated() ?? $request->only(['name', 'description']);

        $category->update([
            'name' => $data['name'] ?? $category->name,
            'description' => $data['description'] ?? $category->description,
        ]);

        if ($request->wantsJson() || $request->ajax() || str_contains($request->header('Accept', ''), 'application/json')) {
            return response()->json($category);
        }

        return redirect()->route('categories.index')->with('success', 'Cập nhật danh mục thành công');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

             flash()
            ->options(['position' => 'bottom-center'])
            ->success('Deleted category successfully!');
        return redirect()->route('categories.index');
    }
}
