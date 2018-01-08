<?php
namespace app\index\model;
use think\Model;

/**
* 
*/
class User extends Model
{
	//protected $table = 'db_user';

	protected function scopeAge($query)
	{
		$query->where('age','12');
	}
}