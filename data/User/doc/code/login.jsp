<%@ page contentType="text/html;charset=gb2312"%>
<script language="JavaScript">
   // ��֤�Ƿ�������С����
   function minLength(str,length)
   {
	   if(str.length>=length)
		   return true;
	   else
		   return false;
   }
   // �ж��Ƿ�������󳤶�
   function maxLength(str,length)
   {
	   if(str.length<=length)
		   return true;
	   else
		   return false;
   }
</script>
<html>
   <head>
      <title>�û���½</title>
   </head>
   <body>
      <h2>�û���¼</h2>
      <form name="form1" action="${pageContext.request.contextPath}/login" method="post"   onsubmit="return isValidate(form1)">
	      �û�����<input type="text" name="username"> <br>
	      ���<input type="password" name="userpass"><br>
	      <input type="reset" value="����">
	      <input type="submit" value="�ύ"><br>
      </form>
   </body>
</html>
