'''
BST
Create another container class for storing unordered unique Students.
It should support the methods: Exists, Insert, Traverse, Delete, Retrieve, and Size.
Implement the methods using a Binary Search Tree (BST).
Repeat the previous assignment using your new BST container class.
Compare the Insert, Traverse, Delete, and Retrieve times to the previous containers.
Verify that the average ages and the error messages are the same.
After you get it working with the regular lists, try it on the Medium sized lists: FakeNamesMedium.txt, DeleteNamesMedium.txt, and RetrieveNamesMedium.txt.
In this case, do not print every student that failed to insert, delete, or retrieve. Just print the total fails in each category.
'''

import time
from student import Student
from bst import BST

ageTotal = 0

def callbackFunction(s):
    global ageTotal
    ageTotal += int(s.mAge)

def main():
    # Insert
    start = time.time()
    f = open("FakeNames.txt")
    allStudents = BST()
    for line in f:
        fields = line.split()
        s = Student(fields[0], fields[1], fields[2], fields[3], fields[4])
        if allStudents.insert(s) == False:
            print("Error: Duplicate SSN for " + s.mFirstName + " " + s.mLastName)
    f.close()
    end = time.time()
    print("Time for insert: " + str(end - start) + " seconds")

    '''
    # Traverse
    start = time.time()
    averageAge = 0
    count = allStudents.size()
    allStudents.traverse(callbackFunction) # Data?
    averageAge = ageTotal/count
    print("Average age: " + str(averageAge))
    end = time.time()
    print("Time for traverse: " + str(end - start) + " seconds")
    '''

    # Delete
    start = time.time()
    f = open("DeleteNames.txt")
    for line in f:
        SSN = line.strip()
        s2 = Student("", "", SSN, "", "") # Dummy student
        if allStudents.delete(s2) == False:
            print("Error: SSN " + SSN + " does not exist.")
    f.close()
    end = time.time()
    print("Time for delete: " + str(end - start) + " seconds")
    return
    
    # Retrieve
    start = time.time()
    f = open("RetrieveNames.txt")
    rTotal = 0
    rAge = 0
    for line in f:
        SSN = line.strip()
        s2 = Student("", "", SSN, "", "")
        retrieved = allStudents.retrieve(s2)
        if retrieved is not None:
            rTotal += 1
            rAge += int(retrieved.mAge)
        else:
            print("Error: SSN " + SSN + " does not exist.")
    if rTotal == 0:
        print("Error: retrieve count == 0")
    else:
        averageAge = rAge/rTotal
        print("Average age: " + str(averageAge))
    f.close()
    end = time.time()
    print("Time for retrieve: " + str(end - start) + " seconds")

main()

'''
Program 5 Comparison

Error: Duplicate SSN for DAMON POTTS
Time for insert: 36.41500735282898 seconds
Average age: 42.92993099769993
Time for traverse: 0.020928382873535156 seconds
Error: SSN 010-16-5079 does not exist.
Time for delete: 45.17820739746094 seconds
Average age: 49.537614132592296
Time for retrieve: 2.071270704269409 seconds

Program 6 Comparison

'''