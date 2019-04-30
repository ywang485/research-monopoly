using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Hypothesis {

    public enum HypothesisType { food, enemy, benefit, harm, habitat, reproduction };

    public string content = "";
    public HypothesisType type = HypothesisType.food;
    public int significance = 5;
    public int numYears = 1;
    public string title = "";

    public Hypothesis(HypothesisType htype, string htitle, string hcontent, int hsignificance, int hyear)
    {
        title = htitle;
        type = htype;
        content = hcontent;
        significance = hsignificance;
        numYears = hyear;
    }
}
