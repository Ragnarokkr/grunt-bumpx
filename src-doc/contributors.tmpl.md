# Contributors
> *If you have an apple and I have an apple and we exchange these apples then you and I will still each have one apple…but if you have an idea and I have an idea and we exchange these ideas, then each of us will have two ideas.* – George Bernard Shaw

Big thanks goes to all whom have contributed in this project:
<% 
var sorting = function ( a, b ) {
  if ( a.name > b.name ) { return 1; }
  if ( a.name < b.name ) { return -1; }
  return 0;
},
data = meta.contributors.sort( sorting );

for ( var i = 0, l = meta.contributors.length; i < l; i++ ) { %>
- <a href="<%= meta.contributors[i].url %>"><%= meta.contributors[i].name %></a>
<% } %>