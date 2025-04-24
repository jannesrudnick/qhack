This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Used Technologies

- Tanstack for caching database query results
- PostgreSQL (with Supabase)
- Tailwindcss for styling
- Supabase functions wie Cronjobs to simulate sensor data and do linear regression to trigger alerts (functions are deployed on server)
- ESP32, industry-standard IoT micro-controller that can connect to the internet

## Hardware - Part

- We use an ESP32 which reads the value of an SGP30 sensor (Humidity, TVOC) and an temperature sensor
- the values are directly inserted into a `measurements` table in our database with a POST request
- found in the `hardware` directory

## Software - Part

- With a database trigger, after each insert of an sensor value we run a function that does linear progression over the last 12 measurement values
- For demonstrating and testing purposes we also added a simulation function which will randomly alter measurement values, since we just had one sensor to test during our 24 hours
- In our nextjs app we render the floor and visualize the datapoints in realtime / with a heatmap and display further information that we can provide with our data
