package com.spendwise.web;

import com.spendwise.model.Expense;
import com.spendwise.repo.ExpenseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")  // ✅ THIS LINE IS REQUIRED
public class ExpenseController {

    private final ExpenseRepository repo;

    public ExpenseController(ExpenseRepository repo) {
        this.repo = repo;
    }

    // GET ALL
    @GetMapping
    public List<Expense> getAll() {
        return repo.findAll();
    }

    // ADD
    @PostMapping
    public Expense add(@RequestBody Expense expense) {
        return repo.save(expense);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Expense update(@PathVariable Long id, @RequestBody Expense updated) {
        Expense exp = repo.findById(id).orElseThrow();

        exp.setAmount(updated.getAmount());
        exp.setCategory(updated.getCategory());

        return repo.save(exp);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}