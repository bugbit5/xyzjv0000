'��ȡע�����ȡ����λ�á�
Dim reg
Set reg=WScript.CreateObject("WScript.Shell") 
Dim regs
regs=reg.RegRead("HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders\Desktop") 
'MsgBox(regs)

'׷���ַ���
temp1="copy C:\EditPlus\others\EditPlus.lnk "+chr(34)
temp2="\EditPlus.lnk"+chr(34)
'MsgBox(temp1+regs+temp2)

'д�ļ�
Set fso = CreateObject("Scripting.FileSystemObject")    
set ts=fso.opentextfile("desktop.cmd",2,true)     
ts.Write temp1+regs+temp2 &VbCrLf
'ts.Write temp1+regs+temp2 
ts.close

Set ws=WScript.CreateObject("WScript.Shell") 
ws.run "desktop.cmd"
ws.run "cmd /k del desktop.cmd &exit"
MsgBox("         ��ϲ��Editplus 3.2    "+VbCrLf+"         kalcaddle ��ǿ���ɰ�"+VbCrLf+"         �̻���װ�ɹ�^_^..."+VbCrLf+VbCrLf+VbCrLf+"ǿ�ҽ��鿪��ClearType����������Ⱦ"+VbCrLf+"�����Եƽ������������Ŀ��"+VbCrLf+"(��ѡ������ ClearType�� ���Ӧ�ü���)")

