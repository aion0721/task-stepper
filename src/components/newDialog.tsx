import { RefObject } from "react";
import { Button, Fieldset, Input, Stack } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field } from "./ui/field";

interface NewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  jobNameRef: RefObject<HTMLInputElement>;
  jobDateRef: RefObject<HTMLInputElement>;
  addJob: () => void;
}

const NewDialog = ({
  open,
  setOpen,
  jobNameRef,
  jobDateRef,
  addJob,
}: NewDialogProps) => {
  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Open Dialog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Job</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Fieldset.Root>
            <Stack>
              <Fieldset.Legend>ジョブ追加</Fieldset.Legend>
              <Fieldset.HelperText>
                必要項目を記載してジョブを新規作成します。
              </Fieldset.HelperText>
            </Stack>
            <Fieldset.Content>
              <Field label="name">
                <Input placeholder="Job name" ref={jobNameRef} />
              </Field>
              <Field label="date">
                <Input type="date" ref={jobDateRef} />
              </Field>
            </Fieldset.Content>
          </Fieldset.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button onClick={addJob}>Save</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default NewDialog;
