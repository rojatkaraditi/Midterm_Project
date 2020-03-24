drop database if exists institute;

create database if not exists institute;

use institute;

create table departments(d_id int primary key auto_increment,
						d_name varchar(100));

create table students (s_id int PRIMARY KEY AUTO_INCREMENT,
						d_id int,
						first_name varchar(50),
                        last_name varchar(100),
                        date_of_birth date,
                        phone_number varchar(50),
                        address varchar(200),
                        student_type varchar(50),
                        semester int,
                        gpa decimal(3,2),
                        constraint department_fk foreign key(d_id) references departments(d_id));
                        
create table professors (p_id int primary key auto_increment,
						d_id int,
                        first_name varchar(50),
                        last_name varchar(100),
                        date_of_birth date,
                        phone_number varchar(50),
                        address varchar(200),
                        constraint professor_department_fk foreign key(d_id) references departments(d_id));
                        
create table courses (c_id int primary key auto_increment,
						c_name varchar(100));
                        
create table students_courses(s_id int,
								c_id int,
                                p_id int,
                                grade char(1),
                                constraint sc_students_fk foreign key(s_id) references students(s_id),
                                constraint sc_courses_fk foreign key(c_id) references courses(c_id),
                                constraint sc_professors_fk foreign key(p_id) references professors(p_id));
                                
create table professors_courses(p_id int,
								c_id int,
                                constraint pc_professors_fk foreign key(p_id) references professors(p_id),
                                constraint pc_courses_fk foreign key(c_id) references courses(c_id));
                                
insert into departments value (default, 'Information Technology'),
								(default, 'Computer Science'),
                                (default, 'Electronics And Telecommunication'),
                                (default, 'Mechanical Engineering'),
                                (default, 'Instrumentation'),
                                (default, 'Civil Engineering'),
                                (default, 'Electrical Engineering'),
                                (default, 'Biomedical Engineering');
insert into students value (default, 1, 'Jane','Doe','1998-02-02', '7041231234','University City, Charlotte','Undergraduate',1,3.2),
							(default, 2, 'John','Doe','1995-05-21', '7043453456','Belk Hall, Charlotte','Masters',2,4),
                            (default, 3, 'Aditi','Rojatkar','1995-01-21', '7045675678','University City, Charlotte','Masters',2,4.0),
                            (default, 4, 'Shweta','Narkar','1998-06-03', '7046786789','University City, Charlotte','Undergraduate',1,3.2),
                            (default, 5, 'Anirban','Acharya','1992-07-27', '7048907890','North Street, Charlotte','Doctorate',5,3.8),
                            (default, 6, 'Mary','Jane','1990-01-14', '7046781234','East Street, Charlotte','Doctorate',6,3.4),
                            (default, 7, 'Peter','Sanders','1997-12-24', '701237890','First Street, Charlotte','Undergraduate',1,3.2),
                            (default, 8, 'Suzie','Myers','1995-11-15', '7045672548','University City, Charlotte','Masters',2,4.0);
                            
insert into professors values (default, 1, 'Janhvi','Patil','1967-02-18','6461234567','Ashford Green, Charlotte'),
								(default, 2, 'Prashant','Vaze','1965-12-29','7045781378','Ashford Green, Charlotte'),
                                (default, 3, 'Mike','Smith','1967-10-21','7049114765','university Terrace, Charlotte'),
                                (default, 4, 'Daniel','Doe','1970-09-07','6468907890','University Terrace, Charlotte'),
                                (default, 5, 'Tony','Chang','1972-03-25','7049991111','Mallard Creek, Charlotte'),
                                (default, 6, 'Crystal','Doe','1960-05-05','6561118790','Ashford Green, Charlotte'),
                                (default, 7, 'Jane','Green','1967-02-18','7045672222','North Tryon Street, Charlotte'),
                                (default, 8, 'Mary','Brown','1965-10-04','7071234567','Terrance Drive, Charlotte');
                                
insert into courses values (default, 'System Integration'),
							(default, 'Robotics'),
                            (default, 'Neural Networks'),
                            (default, 'Thermodynamics'),
                            (default, 'Analytical Instruments'),
                            (default, 'Structural Design'),
                            (default, 'Digital Electronics'),
                            (default, 'Biophysics');
                            
insert into students_courses value (1,1,1,'A'),
									(2,2,2,'B'),
                                    (3,3,3,'C'),
                                    (4,4,4,'A'),
                                    (5,5,5,'B'),
                                    (6,6,6,'C'),
                                    (7,7,7,'U'),
                                    (8,8,8,'A');
                            
insert into professors_courses value (1,1),
										(2,2),
                                        (3,3),
                                        (4,4),
                                        (5,5),
                                        (6,6),
                                        (7,7),
                                        (8,8);
										