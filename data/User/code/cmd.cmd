echo ��������������

reg import php5\pws-php5cgi.reg
reg import php5\pws-php5isapi.reg

echo ��ӷ���ע���

sc create mysql binPath= "D:\EditPlus\tools\php\MySQL5\bin\mysqld.exe" start= auto displayName= mysql
sc start mysql


:��װapache
:start /min D:\EditPlus\tools\php\Apache2\bin\httpd.exe -k install
:start /min D:\EditPlus\tools\php\Apache2\bin\httpd.exe -k start

:�����������ʵ�ֿ��ٿ�������,autoΪ��������delayed-autoΪ�ӳ�������
sc create httpd binPath= "D:\EditPlus\tools\php\Apache2\bin\httpd.exe  -k runservice" start= auto displayName= httpd
sc start httpd


