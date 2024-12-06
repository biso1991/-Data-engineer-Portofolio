import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestPostgresDriver {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://postgres:5432/ecom_db";
        String user = "dbuser";
        String password = "dbpassword";

        try {
            Class.forName("org.postgresql.Driver");
            Connection connection = DriverManager.getConnection(url, user, password);
            System.out.println("Connected successfully.");
            connection.close();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }
}

// test database connet
// javac TestJDBC.java
// java -cp .:path/to/postgresql-42.6.2.jar TestJDBC
