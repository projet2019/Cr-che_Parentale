--- DATABASE  creche ---

DROP DATABASE creche;

CREATE DATABASE  creche;


--- Run migrations first
--- ./manage.py makemigrations
--- ./manage migrate

---Avenue de l'Espinette,16
---1348 Louvain-La-Neuve
---010235487






INSERT INTO module ( name, display_name, handler,icon_file, description) VALUES ('user_mgmt', 'User Management', '/user', 'users.png', 'Users' );

INSERT INTO module ( name, display_name, handler,icon_file, description) VALUES ('parent_mgmt', 'Parent Management', '/parent', 'parents.png', 'Parents' );

INSERT INTO module ( name, display_name, handler,icon_file, description) VALUES ('child_mgmt', 'Child Management', '/child', 'children.png', 'Children' );

INSERT INTO module ( name, display_name, handler,icon_file, description) VALUES ('report_mgmt', 'Report Management', '/report', 'reports.png', 'Reports' );

INSERT INTO module ( name, display_name, handler,icon_file, description) VALUES ('content_mgmt', 'Content Management', '/content', 'contents.png', 'Contents' );

INSERT INTO module ( name, display_name, handler,icon_file, description) VALUES ('bill_mgmt', 'Bill Management', '/bill', 'bills.png', 'Bills' );

INSERT INTO module ( name, display_name, handler,icon_file, description) VALUES ('event_mgmt', 'Event Management', '/event', 'events.png', 'Events' );

INSERT INTO module ( name, display_name, handler,icon_file, description) VALUES ('profile_mgmt', 'Profile Management', '/profile', 'profiles.png', 'Profile' );











