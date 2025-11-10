<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Brand;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Brand::create(['name' => 'Apple']);
        Brand::create(['name' => 'Samsung']);
        Brand::create(['name' => 'Nike']);
        Brand::create(['name' => 'Adidas']);
        Brand::create(['name' => 'Sony']);
        Brand::create(['name' => 'LG']);
        Brand::create(['name' => 'Dell']);
        Brand::create(['name' => 'HP']);
        Brand::create(['name' => 'Microsoft']);
    }
}
