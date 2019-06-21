using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PhDStudentView : MonoBehaviour {

    private Text nameView;
    private Button fireButton;
    private Text numYearLeftView;

    private GameManager gameManager;

    // Need value when instantiated
    public Character supervisor;
    public PhDStudent student;

    // Use this for initialization
    void Start () {
        // Initialization
        gameManager = GameManager.instance;
        nameView = transform.Find("NameView").GetComponent<Text>();
        fireButton = transform.Find("FireButton").GetComponent<Button>();
        numYearLeftView = transform.Find("NumYearLeftView").GetComponent<Text>();

        updateUI();
    }

    void updateUI()
    {
        nameView.text = Util.UppercaseFirst(student.getFirstName()) + " " + Util.UppercaseFirst(student.getLastName());
        numYearLeftView.text = student.getNumYearLeft() + " years left";
        fireButton.GetComponentInChildren<Button>().onClick.AddListener(() => {
            supervisor.fireAPhDStudent(student);
            Destroy(gameObject);
        });
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}
