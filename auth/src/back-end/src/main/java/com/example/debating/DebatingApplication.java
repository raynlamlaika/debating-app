
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DebatingApplication {

	public static void main(String[] args)
	{
		SpringApplication.run(DebatingApplication.class, args);
		// first map the api for my back-end, 
		// the user api: /api/user/create, /api/user/login, /api/user/logout, /api/user/get/{id} ...
		// the debate api:/api/create/newContext, /api/debate/Context/msg, /api/debate/Context/get/{id} ...

		

		
	}

}
