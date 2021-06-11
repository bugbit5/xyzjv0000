package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import beans.*;
import javax.servlet.http.HttpSession;
import javax.servlet.RequestDispatcher;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginServlet extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public LoginServlet() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		 // ��ȡ�û�������û�ID�Ϳ���
	      String userid = request.getParameter("username");
	      String userpass = request.getParameter("userpass");
	      // ����ģ�Ͷ���
	      LoginBean loginBean = new LoginBean();
	      // ����ҵ�񷽷�������֤
	      boolean b = loginBean.validate(userid,userpass);
	      // Ҫת����ļ�
	      String forward;
	      // �����½�ɹ������û���д��session�У�����ת��success.jsp��
//	����ת��failure.jsp
	      if(b){	         
	         // ��ȡsession
	         HttpSession session = (HttpSession)request.getSession(true);
	         // ���û������浽session��
	         session.setAttribute("userid",userid);
	          // Ŀ��ת���ļ���success.jsp
	         forward = "success.jsp";
	      }else{
	         // Ŀ��ת���ļ���failure.jsp
	         forward = "failure.jsp";
	      }	            
	      // ��ȡDispatcher����
	      RequestDispatcher dispatcher = request.getRequestDispatcher(forward);
	      // �����ת
	      dispatcher.forward(request,response);
	}


	/**
	 * The doPost method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to post.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		out
				.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");
		out.println("<HTML>");
		out.println("  <HEAD><TITLE>A Servlet</TITLE></HEAD>");
		out.println("  <BODY>");
		out.print("    This is ");
		out.print(this.getClass());
		out.println(", using the POST method");
		out.println("  </BODY>");
		out.println("</HTML>");
		out.flush();
		out.close();
		doGet(request,response);
	}

	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init() throws ServletException {
		// Put your code here
	}

}
