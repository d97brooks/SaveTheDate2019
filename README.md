# SaveTheDate2019
Me and Lauren's Wedding Invitation/Save The Date. A Node.js server and html pages that will interact with our invited guests to let us know who can and cannot attend. 

I used a template for the main page, but I linked the backend to it and added some fields to the RSVP section. I also added a login for both an admin and a user. The user just needs a code to get in, which will be provided on the invitations that we send out, along with the website. The admin login is also just a variable in the server, but it will just be used to display the data and see who has RSVP'd. 

There is not much else to do functionality wise. Details just need filled in for our wedding, and once that is done it should be ready to go online.

I thought about adding an edit function to the admin portal, but since I will have easy access to the JSON file that the guests will be stored in, I decided agianst it. If I make the time, I would like to add an edit and delete function to the table. These functions would have to take the json file, update date it and then send the updates to the server. Another way to handle it could be by sending the index and new fields to the server and letting the server handle it, which may be more optimal.

TODO:  (delete and edit buttons)
_admin_page_:
  delete - send index to server - > server removes index and updates json file
  edit - send index and new field info - > server updates object at index with fields info.
  
  reminder - notify the server to send a reminder about the wedding to all the guests in the json file who submitted an email.
