# Take Home Assignment

Avinor provides an API to retrieve the flights to specific airports within Norway. For example, the following request will respond with all the flights into and out of Oslo airport:

> https://flydata.avinor.no/XmlFeed.asp?TimeFrom=1&TimeTo=24&airport=OSL&lastUpdate=2022-04-20T15:00:00Z

The names of all the airports within Norway can be found here:

> https://gist.github.com/freshteapot/f5770a6ab29a104293fa6c0576ed9bb9

Your task is to build a simple Web application that uses this API to display information about flights into and out of a selected airports within Norway in the current 24-hour period (i.e. TimeFrom=1&TimeTo=24).

1.	The UI should allow the user to select an airport within Norway using the **full name** of the airport.
2.	In response to an airport selection, a table should be displayed which shows all the **domestic** flights into (arrivals) and out of (departures) that airport. The table should present at least the following information:
    -	Flight name (<flight_id>).
    -	Scheduled departure time (<schedule_time>).
    -	Scheduled arrival time (<schedule_time>).
    -	The full name of the source/destination airport (<airport> mapped to ‘name’).

This task is complicated by the fact that the API will only provide the scheduled time relevant to the requested airport:
1. The departure time for departing flights.
2. The arrival time for arriving flights.

So, in addition to requesting the flights for the selected airport, additional requests must be sent to each airport that the flight is departing to or arriving from to get the corresponding scheduled time. I.e.:
1. The scheduled arrival time for flights departing from the selected airport.
2. The scheduled departure time for flights arriving at the selected airport.

Flights between airports can be matched using the “flight_id” and “arr_dep” fields. The scheduled time for flights that cannot be matched should be indicated – e.g. by stating “unknown”
It is important to ensure that requests to get the corresponding scheduled times are performed efficiently.

**Additional information:**
1. Domestic flights will have the <dom_int> flag set to ‘D’.
2. The Avinor servers do not appear to support CORS so you will need to use a CORS proxy service such as Local CORS Proxy (https://www.npmjs.com/package/local-cors-proxy).
3. An explanation of the flight API can be found at https://avinor.no/konsern/tjenester/flydata/flydata-i-xml-format. 
4. Displaying additional information about each flight will be advantageous. For example, including the flight status in an intuitive way (e.g. background color / icons). Flight status explanations can be found at https://flydata.avinor.no/flightStatuses.asp
