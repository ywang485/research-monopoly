using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PhDStudent {

    public static int defaultNumYears = 6;

    private string firstName;
    private string lastName;

    private int numYearsLeft;

    public string getFirstName ()
    {
        return firstName;
    }

    public string getLastName()
    {
        return lastName;
    }

    public int getNumYearLeft()
    {
        return numYearsLeft;
    }

    public void delayGraduation(int numYears)
    {
        numYearsLeft += numYears;
    }

    public void yearPasses(int numYears)
    {
        numYearsLeft -= numYears;
    }

    public PhDStudent(string newFirstName, string newLastName, int newNumYearsLeft)
    {
        firstName = newFirstName;
        lastName = newLastName;
        numYearsLeft = newNumYearsLeft;
    }

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
