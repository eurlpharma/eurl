import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { QuickAbout as Quicks } from "@/data/quickAbout";

const QuickAbout = () => {
  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div>
      {Quicks.map((q) => (
        <Accordion
          key={q.key}
          expanded={expanded === q.key}
          onChange={handleChange(q.key)}
          className="dark:bg-black/10 bg-black rounded-none before:hidden shadow-none"
        >
          <AccordionSummary
            color="primary"
            aria-controls={q.key}
            id={`${q.key}-header`}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography component="span">{q.key}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{q.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default QuickAbout;
