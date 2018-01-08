<?php

namespace app\index\controller;
header("Access-Control-Allow-Origin: *");

use app\index\model\User as UserModel;
use think\Controller;

class User extends Controller
{
    use \traits\controller\Jump;

    public function addUser($name, $age)
    {
        $user = new UserModel;
        $user->name = $name;
        $user->age = $age;
        if ($user->save()) {
            return 'success';
        } else {
            return $user->getError();
        }
    }

    public function delUser($id)
    {
        $user = UserModel::get($id);
        if ($user) {
            $user->delete();
            return 'success';
        } else {
            return 'error';
        }

    }

    public function editUser($id, $name, $age)
    {
        $user = UserModel::get($id);
        $user->name = $name;
        $user->age = $age;
        if (false !== $user->save()) {
            return "success";
        } else {
            return $user->getError();
        }
    }

    public function readUser($id = '')
    {
        $user = UserModel::get($id);
        echo $user->name . '<br/>';
        echo $user->age . '<br/>';
        echo $user->birthday;
    }

    public function readUserScope()
    {
        $list = UserModel::scope('age')
            ->scope(function ($query) {
                $query->order('id', 'desc');
            })
            ->all();
        foreach ($list as $user) {
            echo $user->id . '<br/>';
            echo $user->name . '<br/>';
            echo $user->age . '<br/>';
            echo "_______" . '<br/>';
        }
    }

    public function userView()
    {
        $list = UserModel::paginate(3);
        $this->assign('list', $list);
        $this->assign('count', count($list));
        return $this->fetch();
    }

    public function userLogin($name)
    {
        if ($name == 'asdf') {
            $this->redirect('../hello');
        } else {
            return 'error';
        }
    }

    public function userVerify($name)
    {
        if ($name == 'asdf') {
            return 'success';
        } else {
            return 'error';
        }
    }

    public function showName(){

    }
}
