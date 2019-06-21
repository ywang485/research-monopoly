using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PhDStudentSelect : MonoBehaviour {

    private Text nameView;
    private Button selectButton;
    private Text numYearLeftView;

    private GameManager gameManager;

    // Need value when instantiated
    public Character supervisor;
    public PhDStudent student;

    // Use this for initialization
    void Start()
    {
        // Initialization
        gameManager = GameManager.instance;
        nameView = transform.Find("NameView").GetComponent<Text>();
        selectButton = transform.Find("SelectButton").GetComponent<Button>();
        numYearLeftView = transform.Find("NumYearLeftView").GetComponent<Text>();

        updateUI();
    }

    void select(PhDStudent student)
    {
        transform.parent.GetComponent<PhDStudentInvestView>().studentsChosen.Add(student);
        selectButton.GetComponentInChildren<Text>().text = "Unselect";
        selectButton.GetComponentInChildren<Button>().onClick.AddListener(() => {
            unselect(student);
        });
    }

    void unselect(PhDStudent student)
    {
        transform.parent.GetComponent<PhDStudentInvestView>().studentsChosen.Remove(student);
        selectButton.GetComponentInChildren<Text>().text = "Select";
        selectButton.GetComponentInChildren<Button>().onClick.AddListener(() => {
            select(student);
        });
    }

    void updateUI()
    {
        nameView.text = Util.UppercaseFirst(student.getFirstName()) + " " + Util.UppercaseFirst(student.getLastName());
        numYearLeftView.text = student.getNumYearLeft() + " years left";
        selectButton.GetComponentInChildren<Button>().onClick.AddListener(() => {
            select(student);
        });
    }
}
