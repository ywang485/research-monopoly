﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PhDStudentInvestView : MonoBehaviour {

    private GameManager gameManager;
    private PhDStudentView[] studentViews;

    public ArrayList studentsChosen;

    // Use this for initialization
    void Awake()
    {
        gameManager = GameManager.instance;
        studentsChosen = new ArrayList();
    }

    public void updateList()
    {

        int count = 0;
        int posXbase = 50;
        int posXoffset = 150;
        int posYoffset = 0;

        Debug.Log(gameManager);

        Transform container = transform.Find("StudentViewContainer");

        foreach (Transform child in container.transform)
        {
            GameObject.Destroy(child.gameObject);
        }

        studentViews = new PhDStudentView[gameManager.getCurrPlayer().getListOfStudent().Length];
        foreach (PhDStudent stu in gameManager.getCurrPlayer().getListOfStudent())
        {
            GameObject studentView = GameObject.Instantiate(Resources.Load(ResourceLibrary.phdstudentSelectPrefab, typeof(GameObject)) as GameObject, container);
            studentView.GetComponent <PhDStudentSelect>().supervisor = gameManager.getCurrPlayer();
            studentView.GetComponent<PhDStudentSelect>().student = stu;
            studentView.GetComponent<RectTransform>().anchoredPosition = new Vector2(posXbase + posXoffset * count, posYoffset);
            studentViews[count] = studentView.GetComponent<PhDStudentView>();

            /* EventTrigger.Entry entry = new EventTrigger.Entry();
            entry.eventID = EventTriggerType.PointerEnter;
            entry.callback.AddListener((data) => { showIngredientId(iid); });
            ingredientBtn.GetComponentInChildren<EventTrigger>().triggers.Add(entry);

            EventTrigger.Entry entry2 = new EventTrigger.Entry();
            entry2.eventID = EventTriggerType.PointerExit;
            entry2.callback.AddListener((data) => { hideRecipe(); });
            ingredientBtn.GetComponentInChildren<EventTrigger>().triggers.Add(entry2);
            */

            count += 1;
        }
    }

    // Update is called once per frame
    void Update()
    {

    }
}
