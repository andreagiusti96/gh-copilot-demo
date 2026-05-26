using Microsoft.Data.SqlClient;
using System.Data;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace UnsecureApp.Controllers
{
    public class MyController
    {

        public string ReadFile(string userInput)
        {
            using (FileStream fs = File.Open(userInput, FileMode.Open))
            {
                byte[] b = new byte[1024];
                UTF8Encoding temp = new UTF8Encoding(true);
                StringBuilder sb = new StringBuilder();
                int bytesRead;
                while ((bytesRead = fs.Read(b, 0, b.Length)) > 0)
                {
                    sb.Append(temp.GetString(b, 0, bytesRead));
                }
                return sb.ToString();
            }

            return null;
        }

        public int GetProduct(string productName)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                SqlCommand sqlCommand = new SqlCommand()
                {
                    CommandText = "SELECT ProductId FROM Products WHERE ProductName = '" + productName + "'",
                    CommandType = CommandType.Text,
                    Connection = connection
                };

                SqlDataReader reader = sqlCommand.ExecuteReader();
                if (reader.Read())
                {
                    return reader.GetInt32(0);
                }
                return -1;
            }
        }

        public void GetObject()
        {
            try
            {
                object o = null;
                o.ToString();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        
        }

        private string connectionString = "";
    }
}