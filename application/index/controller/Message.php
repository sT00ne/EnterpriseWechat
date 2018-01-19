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
    public static $access_token = "wVDxbzjqJcXL6bN969S70fHQLceSUN81prGl5TarmRg_GcCVfLOati7-Yp7wHyzjs8ZjXLMfZK6uYtwnkNR3sPV5c2tsG73D_2XpdbYxjcJTJfVSpRhTcoDrb_3iDazOTsitw2Yhmr5Odh9pCSsAbEZlMa50IqYrNQ-UQ2cSpvQAzrnJGoft27dkilaNlktWlxeQnWiUh-AviKtWBzSSkA";

    public function index()
    {
        $department = $this->getDepartment();
        $this->assign('dep', json_decode(json_encode($department), true));
        return view();
    }

    public function getDepartment()
    {
        $CORPID = "ww25fbb3c09506777e";
        $CORPSECRET = "b7h7g_pfP17869eU-4-Di1AFMNSxX3JEV6d31aRG898";
        $urlStr = "https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=" . self::$access_token;
        $department = $this->processUrl($urlStr)->department;
        return $department;
    }

    public function processUrl($urlStr)
    {
        $json = file_get_contents($urlStr);
        $obj = json_decode($json);
        return $obj;
    }

    public function getUser(Request $request)
    {
        $CORPID = "ww25fbb3c09506777e";
        $CORPSECRET = "b7h7g_pfP17869eU-4-Di1AFMNSxX3JEV6d31aRG898";
        $department = $request->param("department");
        $urlStr = "https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=" . self::$access_token
            . "&department_id=" . $department . "&fetch_child=1";
        $user = $this->processUrl($urlStr)->userlist;
        return json_encode($user);
    }

    public function sendMessage(Request $request)
    {
        $department = $request->param("department");
        $user = $request->param("userId");
        $message = $request->param("message");
        if ($user == 0) {
            $text = "{\"touser\" : \"\",\"toparty\" : \"" . $department . "\",";
        } else {
            $text = "{\"touser\" : \"" . $user . "\",\"toparty\" : \"\",";
        }
        $text .= "\"totag\" : \"\",\"msgtype\" : \"text\",\"agentid\" : 1000002,"
            . "\"text\" : {\"content\" : \"" . $message . "\"},\"safe\":0}";
        $url = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" . self::$access_token;
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
        if (json_decode($output)->errcode == 0) {
            return "success";
        } else {
            return "error";
        }

    }

    /**
     * 验证，并接收消息
     * @return string
     */
    public function Verify()
    {
        vendor('XcxAes.WXBizMsgCrypt');
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
            return $this->replyMsgToUser($token, $encodingAesKey, $corpId, $ToUserName, $FromUserName, $content);
        } else {
            print("ERR: " . $errCode . "\n\n");
        }


//        $token = '7Q1yw0AmoXboWzuD';
//        $EncodingAESKey = 'eA9KiuFHnhebbQCOLa0FLTVk5FsmLv2U2uFjoHCBaKp';
//        $CORPID = "ww25fbb3c09506777e";
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

    /**
     * 被动回复消息
     * @param $token
     * @param $encodingAesKey
     * @param $corpId
     * @param $ToUserName
     * @param $FromUserName
     * @param $content
     * @return string
     */
    function replyMsgToUser($token, $encodingAesKey, $corpId, $ToUserName, $FromUserName, $content)
    {
        // 需要发送的明文消息
        // TODO：根据用户提交过来的操作封装此数据包
        $sRespData = "<xml><ToUserName>" . $ToUserName . "</ToUserName><FromUserName>" . $FromUserName . "</FromUserName>"
            . "<CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[test:" . $content . "]]></Content></xml>";
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