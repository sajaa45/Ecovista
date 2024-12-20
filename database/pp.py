import mysql.connector

# Step 1: Connect to MySQL
connection = mysql.connector.connect(
    host="127.0.0.1",        # Replace with your MySQL server address
    user="root",    # Replace with your MySQL username
    password="Gilmore2003*",# Replace with your MySQL password
    database="ecovista" # Replace with your database name
)

cursor = connection.cursor()

# Step 2: Run a Query
query = "DELETE FROM Destinations WHERE name = 'Beach Paradise';"
cursor.execute(query)
connection.commit()
query = "select * from Destinations"
cursor.execute(query)

# Step 3: Fetch and Print Results
results = cursor.fetchall()
for row in results:
    print(row)

# Step 4: Close the Connection
cursor.close()
connection.close()
