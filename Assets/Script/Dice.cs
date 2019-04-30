using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Dice : MonoBehaviour {

    static public Dice instance;

    public Sprite[] faces;
    private bool isRolling;
    private AudioSource audioSrc;

    private int frameCounter;
    private int frameCounterMax = 5;
    private int currFaceIdx = 0;

    public bool disabled;

    private void Awake()
    {
        instance = this;
    }

    public void setPoint(int point)
    {
        if (!disabled)
        {
            stopRolling();
            GameManager.instance.playSFX(Resources.Load<AudioClip>(ResourceLibrary.diceRollSFX));
            Debug.Log("Rolled " + (point));
            GameManager.instance.makeCharacterMove(point);
            GameManager.instance.loseOneControlDice();
        }
    }

    public void getPoint()
    {
        if (!disabled)
        {
            stopRolling();
            GameManager.instance.playSFX(Resources.Load<AudioClip>(ResourceLibrary.diceRollSFX));
            int point = currFaceIdx + 1;
            Debug.Log("Rolled " + (point));
            GameManager.instance.makeCharacterMove(point);
        }
    }

	// Use this for initialization
	void Start () {
        frameCounter = 0;
        disabled = false;
        audioSrc = GetComponent<AudioSource>();
	}
	
	// Update is called once per frame
	void Update () {
		if (isRolling)
        {
            frameCounter += 1;
            if (frameCounter >= frameCounterMax)
            {
                frameCounter = 0;
                currFaceIdx = (currFaceIdx + 1) % faces.Length;
                GetComponent<Image>().sprite = faces[currFaceIdx];
            }
        }
	}

    public void roll()
    {
        if (!disabled)
        {
            isRolling = true;
            audioSrc.Play();
        }
    }

    public void stopRolling()
    {
        isRolling = false;
        audioSrc.Stop();
    }
}
