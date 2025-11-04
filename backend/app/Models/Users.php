<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Users extends Model
{
    /** @use HasFactory<\Database\Factories\UsersFactory> */
    use HasFactory, Notifiable;

    protected $table = 'user';
    protected $primaryKey = 'id';


    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'role',
        'status',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
}
