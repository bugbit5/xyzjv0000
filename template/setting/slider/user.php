<div class='h1'><i class="font-icon icon-user"></i>用户设置</div>
<div class="section">
	<div class='box'>
		<span >用户名</span>
		<input type="text" id="name" value="<?=$this->config['user_name'];?>" />
		<a onclick="tools('name');" href="javascript:void(0);" class="save button">保存</a>
		<div class='line login'></div>
		
		<span >原密码</span>
		<input type="text" id="password_now" value="" />
		<div class='line'></div>
		<span >修改为</span>
		<input type="password" id="password_new" value=""/><div class='upasswordinfo'></div>
		<a onclick="tools('password');" href="javascript:void(0);" class="save button">保存</a><div class='line login2'></div>
	</div>
</div>	
