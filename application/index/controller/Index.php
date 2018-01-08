<?php

namespace app\index\controller;

use think\Controller;
use think\Db;
use app\index\model\User as UserModel;
use think\Exception;
use think\Request;
use think\Session;

class Index extends Controller
{
    public function index()
    {
        return 'hello world!';
    }

    public function testfunction()
    {
        return 'test function.';
    }

    public function hello($name = 'yourname')
    {
        echo 'url:' . $this->request->url() . '<br/>';
        $this->assign('name', $name);
        $data = Db::name('user')->find();
        $this->assign('result', $data);
        return $this->fetch();
    }

    public function main(Request $request)
    {
        $code = $request->param('code');
        echo "code:" . $request->param('code') . "<br/>";
        //token
        if (!Session::get('wechatToken')) {
            $this->getToken();
        } else {
            echo "session-token:" . Session::get('wechatToken') . "<br/>";
        }
        //user
        if (!Session::get('wechatUser')) {
            $this->getUser($code);
        } else {
            echo "session-user:" . Session::get('wechatUser') . "<br/>";
        }
        return view();
    }

    public function getToken()
    {
        $CORPID = "ww25fbb3c09506777e";
        $CORPSECRET = "b7h7g_pfP17869eU-4-Di1AFMNSxX3JEV6d31aRG898";
        $urlStr = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" . $CORPID . "&corpsecret=" . $CORPSECRET;
        $this->processUrl($urlStr);
    }

    public function processUrl($urlStr)
    {
        $json = file_get_contents($urlStr);
        $obj = json_decode($json);
        echo "token:" . $obj->access_token . "<br/>";
        Session::set('wechatToken', $obj->access_token);
    }

    public function getUser($code)
    {
        $token = Session::get('wechatToken');
        $urlStr = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=" . $token . "&code=" . $code;
        $json = file_get_contents($urlStr);
        $obj = json_decode($json);
        if ($obj->errcode == 0) {
            echo "userId:" . $obj->UserId . "<br/>";
            Session::set('wechatUser', $obj->UserId);
        } else {
            echo "userId:" . "error" . "<br/>";
        }
    }

    public function sendText()
    {
        $text = "{\"touser\" : \"wangshidong\",\"toparty\" : \"\","
            . "\"totag\" : \"\",\"msgtype\" : \"text\",\"agentid\" : 1000002,"
            . "\"text\" : {\"content\" : \"123456\"},\"safe\":0}";
        $this->sendMessage($text);
    }

    public function sendMessage($text)
    {
        $url = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" . Session::get('wechatToken');
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        if (!empty($text)) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $text);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        $output = curl_exec($curl);
        curl_close($curl);
        if($output->errcode==0){
            echo "success";
        }else{
            echo "error";
        }
    }
}
