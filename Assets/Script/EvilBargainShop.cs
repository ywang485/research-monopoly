using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class EvilBargainShop : MonoBehaviour {

    private Text promptText;
    private Button getOneButton;

	// Use this for initialization
	void Start () {
        promptText = transform.Find("PromptText").GetComponent<Text>();
        getOneButton = transform.Find("GetControlDice").GetComponent<Button>();
	}
	
	// Update is called once per frame
	void Update () {
        Character ch = GameManager.instance.getCurrPlayer();
        if (ch.getFame() < GameManager.costOfControlDice)
        {
            getOneButton.enabled = false;
        }
        promptText.text = "You can get rigged dice here, but this will cost 10 fame.\n\n" +
            "Current fame: " +ch.getFame() + "\n" + "# rigged dice: "  +  ch.getNumControlDice();
	}
}
