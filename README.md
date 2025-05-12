# Contacts Manager App
## Description
The backend API was written in ASP.NET with C# and SQLite. It follows REST API rules.

The frontend was written in React with Typescript and TailwindCSS.

My interpretation of the instruction:
- contacts list contains e-mail and password (I don't know why - probably a mistake in the instruction. Normally, I would remove the password from Contact as it doesn't make sense to store someone else's password)
- users created for logging in are not connected to the contact list:
    - Contacts are not owned by Users (i.e. not tied to specific user accounts).
    - Any user can edit/delete/add contacts, assuming they are logged in.
    - The contact list is shared globally, and access is managed by whether someone is logged in — not by who created what.
- unique e-mail and password requirements are for users, not for contacts


## Used Nuget Packages
- Microsoft.EntityFrameworkCore.Sqlite - SQLite database (single file)
- Microsoft.EntityFrameworkCore.Tools for enabling Add-Migration and Update-Database commands
- Microsoft.AspNetCore.Authentication.Cookies - Manages HttpContext and adds SignInAsync() function
- AutoMapper.Extensions.Microsoft.DependencyInjection for DTO to object mappers