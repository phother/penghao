package webapp;

import org.springframework.http.HttpHeaders;
import org.springframework.util.MimeTypeUtils;

public class Test {

	public static void main(String[] args) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "Content-Type: text/xml");
		System.out.println(headers.getContentType());
	}

}
