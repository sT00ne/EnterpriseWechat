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
    private $_receive;
    private $agentidxml;

    public function index()
    {
        return view();
    }

    public function Verify($return = false)
    {
        $token = '7Q1yw0AmoXboWzuD';
        $encodingAesKey = 'eA9KiuFHnhebbQCOLa0FLTVk5FsmLv2U2uFjoHCBaKp';
        $corpId = "ww25fbb3c09506777e";

        //TODO:配置接收消息的应用相关信息
        $sReqMsgSig = $_GET["msg_signature"];
        $sReqTimeStamp = $_GET["timestamp"];
        $sReqNonce = $_GET["nonce"];
        $sReqData = file_get_contents("php://input");
        $sMsg = "";  // 解析之后的明文
        $wxcpt = new \WXBizMsgCrypt($token, $encodingAesKey, $corpId);
        $errCode = $wxcpt->DecryptMsg($sReqMsgSig, $sReqTimeStamp, $sReqNonce, $sReqData, $sMsg);
        if ($errCode == 0) {
            // 解密成功，sMsg即为xml格式的明文
            $xml = new \DOMDocument();
            $xml->loadXML($sMsg);
            //取出发送消息的UserID
            $FromUserName = $xml->getElementsByTagName('FromUserName')->item(0)->nodeValue;
            $ToUserName = $xml->getElementsByTagName('ToUserName')->item(0)->nodeValue;
            //取出发送的消息内容体
            $content = $xml->getElementsByTagName('Content')->item(0)->nodeValue;
            //TODO ... 业务逻辑
            //Db::execute('insert into think_user (id, name) values (?, ?)',[8,'thinkphp']);
            return $this->replyMsgToUser($token, $encodingAesKey, $corpId, $ToUserName, $FromUserName, $content);
        } else {
            print("ERR: " . $errCode . "\n\n");
        }

//        $sMsgSignature = $_GET['msg_signature'];
//        $sTimeStamp = $_GET['timestamp'];
//        $sNonce = $_GET['nonce'];
//        $sEchoStr = $_GET['echostr'];
//
//        vendor('XcxAes.WXBizMsgCrypt');
//        $wx = new \WXBizMsgCrypt($token, $EncodingAESKey, $CORPID);
//        header('content-type:text');
//        $EchoStr = "";
//        $errCode = $wx->VerifyURL($sMsgSignature, $sTimeStamp, $sNonce, $sEchoStr, $EchoStr);
//        if ($errCode == 0) {
//            header('content-type:text');
//            echo $EchoStr;
//        } else {
//            print("ERROR:" . $errCode);
//        }
    }

    function replyMsgToUser($token, $encodingAesKey, $corpId, $ToUserName, $FromUserName, $content)
    {
        // 需要发送的明文消息
        // TODO：根据用户提交过来的操作封装此数据包
        $sRespData = "<xml><ToUserName>" . $ToUserName . "</ToUserName><FromUserName>" . $FromUserName . "</FromUserName>"
            . "<CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[test:".$content."]]></Content></xml>";
        $sEncryptMsg = ""; //xml格式的密文
        $wxcpt = new \WXBizMsgCrypt($token, $encodingAesKey, $corpId);
        $sReqTimeStamp = $_GET["timestamp"];
        $sReqNonce = $_GET["nonce"];
        $errCode = $wxcpt->EncryptMsg($sRespData, $sReqTimeStamp, $sReqNonce, $sEncryptMsg);
        if ($errCode == 0) {
            // 加密成功，企业需要将加密之后的sEncryptMsg返回
            // TODO:向企业微信的后台回复消息
            return $sEncryptMsg;
        } else {
            print("ERR: " . $errCode . "\n\n");
            // exit(-1);
        }
    }
}