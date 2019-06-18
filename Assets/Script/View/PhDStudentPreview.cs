using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PhDStudentPreview : MonoBehaviour {

    public static int minLowestFame = 100;
    public static int maxLowestFame = 1000;

    private PhDStudent student;
    private Text nameView;
    private Button selectButton;
    private Text lowestFameView;

    private GameManager gameManager;

	// Use this for initialization
	void Start () {

        // Initialization
        gameManager = GameManager.instance;
        nameView = transform.Find("NameView").GetComponent<Text>();
        selectButton = transform.Find("SelectButton").GetComponent<Button>();
        lowestFameView = transform.Find("FameReqView").GetComponent<Text>();

        // Generate a random PhD student
        // Generate gender
        int gender = Random.Range(0, 2);

        // Generate gender related name
        string firstName;
        string lastName;

        if (gender > 0)
        {
            firstName = CharacterContentLibrary.maleFirstNames[Random.Range(0, CharacterContentLibrary.maleFirstNames.Length)];
        }
        else
        {
            firstName = CharacterContentLibrary.femaleFirstNames[Random.Range(0, CharacterContentLibrary.femaleFirstNames.Length)];
        }
        lastName = CharacterContentLibrary.lastNames[Random.Range(0, CharacterContentLibrary.lastNames.Length)];

        student = new PhDStudent(firstName, lastName, PhDStudent.defaultNumYears);

        // Generate a fameRequirement
        int fameReq = Random.Range(minLowestFame, maxLowestFame);

        // Update UI
        nameView.text = Util.UppercaseFirst(student.getFirstName()) + " " + Util.UppercaseFirst(student.getLastName());
        lowestFameView.text = "at least " + fameReq + " fame";
        selectButton.GetComponentInChildren<Button>().onClick.AddListener(() => gameManager.hirePhDStudent(student));
        if (gameManager.getCurrPlayer().getFame() < fameReq)
        {
            selectButton.enabled = false;
            selectButton.GetComponentInChildren<Text>().text = ":(";
        } else
        {
            selectButton.enabled = true;
            selectButton.GetComponentInChildren<Text>().text = "Hire";
        }
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}
