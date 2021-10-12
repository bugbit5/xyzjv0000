<?php


class SSO{
	static private function init(){
		$sessionName = 'KOD_SESSION_SSO';
		$sessionID   = $_COOKIE[$sessionName]?$_COOKIE[$sessionName]:md5(uniqid());
		$sessionPath = dirname(dirname(dirname(__FILE__))).'/data/session/';
		@session_write_close();
		@session_name($sessionName);
		@session_save_path($sessionPath);
		@session_id($sessionID);
		@session_start();
		//echo '<pre>';var_dump($_SESSION);echo '</pre>';exit;
		return $_SESSION;
	}

	/**
	 * 设置session 认证
	 * @param  [type] $key [认证key]
	 */
	static public function sessionSet($key,$value='success'){
		self::init();
		@session_start();
		$_SESSION[$key] = $value;
		@session_write_close();
	}


	static public function sessionCheck($key,$value='success'){
		$session = self::init();
		if( isset($session[$key]) && 
			$session[$key] == $value){
			return true;
		}
		return false;
	}

	/**
	 * 直接调用kod的登陆检测(适用于同服务器同域名;)
	 * @param  [type] $kodHost kod的地址;例如 http://test.com/
	 * @param  [type] $appKey  应用标记 例如 loginCheck
	 * @param  [type] $appUrl  验证后跳转到的url
	 * @param  [type] $auth    验证方式：例如:'check=userName&value=smartx'
	 *          check (userID|userName|roleID|roleName|groupID|groupName) 校验方式,为空则所有登陆用户
	 */
	static public function sessionAuth($appKey,$auth,$kodHost,$appUrl=''){
		$authUrl = rtrim($kodHost,'/').'/index.php?user/sso&app='.$appKey.'&'.$auth;
		if($appUrl == ''){
			$appUrl = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['SERVER_NAME'].
					':'.$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
		}
		if(!self::sessionCheck($appKey)){
			header('Location: '.$authUrl.'&link='.rawurlencode($appUrl));
			exit;
		}
	}
}
