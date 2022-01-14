INSERT INTO department (depart_name)
VALUES("Production"),
    ("Research & Development"),
    ("Purchasing"),
    ("Marketing & Sales"),
    ("Human Resources"),
    ("Accounting & Finance"),
    ("Customer Service");


INSERT INTO role (title,salary,department_id)
VALUES 
    ("CEO",110000,NULL),
    ("Operations Mgr", 90000,1),
    ("Engineering-Lead",80000,1),
    ("Associate",51000.00,1),
    ("Supply-Chain Mgr",85000.00,1),
    ("Logistics-Attdt",54000.00,1),
    ("Quality-Control Mgr",90000.00,1),
    ("Quality Engineer",80000.00,1),

    ("Operations Mgr",80000.00,2),
    ("Design-Lead",69000.00,2),
    ("Testing-Lead",64000.00,2),
    ("Associate",51000.00,2),

    ("Operations Mgr",80000.00,3),
    ("Senior Buyer",67000.00,3),
    ("Assist. Buyer",63000.00,3),
    ("Support Staff",52000.00,3),

    ("Operations Mgr",80000.00,4),
    ("Senior Designer",65000.00,4),
    ("Copy Writer",62500.00,4),
    ("Social-Media Expert",55000.00,4),

    ("Operations Mgr",95000.00,5),
    ("Admin Expert",80000.00,5),
    ("Strateic Partner",78300.00,5),
    ("Employee Advocate",70000.00,5),

    ("Operations Mgr",85000.00,6),
    ("Treasury Manager",75000.00,6),
    ("Financial Controller",70000.00,6),
    ("Accountant",65000.00,6),

    ("Operations Mgr",83000.00,7),
    ("Coach",67000.00,7),
    ("Representative",60000.00,7);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ("Dwayne","Johnson",1,NULL),
        ("Harvey","Specter",2,1),
        ("Ragnar","Lothbrook",9,1),
        ("Bjorn","Ironside",13,1),
        ("Mike","Ross",17,1),
        ("Jessica","Pearson",21,1),
        ("Alfred","Stan",25,1),
        ("James","Potter",29,1),

        ("Sam","Hunt",3,2),
        ("Marshall","Mathers",4,2),
        ("Bahwinder","Singh",4,2),
        ("Chris","Pratt",5,2),
        ("Chris","Evans",6,2),
        ("Mark","Ruffalo",6,2),
        ("Kevin","Deveau",7,2),
        ("Tupac","Shakur",8,2),
        ("John","Legend",8,2),

        ("Jessica","Alba",10,3),
        ("Rachel","Zane",11,3),
        ("Karan","Sodhi",12,3),
        ("Sukhjinder","Singh",12,3),

        ("Arsh","Mahal",14,4),
        ("Gurwinder","Sidhu",14,4),
        ("Palwinder","Brar",15,4),
        ("Yadi","Sidhu",15,4),
        ("Diljit","Dosanjh",16,4),
        ("Sonam","Bajwa",16,4),
        ("Harry","Potter",16,4),

        ("Chris","Evans",18,5),
        ("David","Beckham",19,5),
        ("Downey","Jr.",19,5),
        ("Tim","Horton",20,5),
        ("Usain","Bolt",20,5),

        ("Adam","Levine",22,6),
        ("Hugh","Erikson",22,6),
        ("Aman","Kaur",23,6),
        ("Jaskirat","Neelam",23,6),
        ("Rutva","Shah",24,6),
        ("Ritika","Kaushal",24,6),
        ("Kakoli","Das",24,6),

        ("Lionel","Messi",26,7),
        ("Chris","Ronaldo",27,7),
        ("Manveen","Gill",28,7),
        ("Pulisic","Peters",28,7),
        ("Jack","Grealish",28,7),

        ("Pep","Guardiola",30,8),
        ("Gurgen","Klopp",30,8),
        ("Alex","Arnold",31,8),
        ("James","Milner",31,8),
        ("Neymar","Jr.",31,8);
       