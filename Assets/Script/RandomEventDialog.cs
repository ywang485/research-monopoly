using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class RandomEventDialog : MonoBehaviour {

    public void closeDialogOnly()
    {
        GameObject.Destroy(gameObject);
    }

    public void startGame()
    {
        SceneManager.LoadScene("GamePlay");
    }

    public void closeDialog()
    {
        GameManager.instance.characterTurnEnds();
        GameObject.Destroy(gameObject);
    }

    public void executePreconfiguredEventEffect(int idx)
    {
        if (idx == 0)
        {
            GameManager.instance.increaseHotnessBy2(2);
            GameManager.instance.increaseHotnessBy2(3);
        } else if (idx == 1)
        {
            GameManager.instance.increaseHotnessBy2(0);
            GameManager.instance.increaseHotnessBy2(1);
            GameManager.instance.increaseHotnessBy2(4);
            GameManager.instance.increaseHotnessBy2(5);
        } else if (idx == 2)
        {
            GameManager.instance.currPlayerGainLife(2);
        } else if (idx == 3)
        {
            GameManager.instance.currPlayerLoseLife(3);
        } else if (idx == 4)
        {
            GameManager.instance.decreaseHotnessBy2(2);
            GameManager.instance.decreaseHotnessBy2(3);
        } else if (idx == 5)
        {
            GameManager.instance.decreaseHotnessBy2(0);
            GameManager.instance.decreaseHotnessBy2(1);
            GameManager.instance.decreaseHotnessBy2(4);
            GameManager.instance.decreaseHotnessBy2(5);
        }
        closeDialog();
    }

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
