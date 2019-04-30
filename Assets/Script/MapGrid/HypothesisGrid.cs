using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HypothesisGrid : MapGrid {

    public int hypothesisIdx;
    public GameObject unverifiedIndicator;
    public GameObject publishedIndicator;

    public static readonly int maxInvestigationPossible = 50;
    public Dictionary<int, int> investigation;
    public bool published = false;
    public bool verified = false;

    void Start()
    {
        changeSpriteAccordingToHType();
    }

    void changeSpriteAccordingToHType()
    {
        GetComponent<SpriteRenderer>().sprite = GameManager.instance.hypIcons[GameManager.instance.type2idx(ResourceLibrary.hypothesisLib[hypothesisIdx].type)];
    }

    public HypothesisGrid()
    {
        investigation = new Dictionary<int, int>();
    }

    public void setVerified()
    {
        verified = true;
        Color c = unverifiedIndicator.GetComponent<SpriteRenderer>().color;
        unverifiedIndicator.GetComponent<SpriteRenderer>().color = new Color(c.r, c.g, c.b, 0.0f);
    }

    public void setPublished()
    {
        published = true;
        Color c = unverifiedIndicator.GetComponent<SpriteRenderer>().color;
        publishedIndicator.GetComponent<SpriteRenderer>().color = new Color(c.r, c.g, c.b, 1.0f);
    }

}
