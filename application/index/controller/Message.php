<?php
/**
 * Created by PhpStorm.
 * User: Admin
 * Date: 2018/1/8
 * Time: 13:33
 */
namespace app\index\controller;

use think\Controller;
use think\Db;
use app\index\model\User as UserModel;
use think\Exception;
use think\Request;
use think\Session;

class Message extends Controller
{
    public function index()
    {
        return 'hello world!';
    }

    public function getMessage(){
        
    }
}