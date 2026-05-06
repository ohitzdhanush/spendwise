package com.spendwise.web;

import com.spendwise.model.Expense;
import com.spendwise.repo.ExpenseRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseRepository repo;

    public ExpenseController(ExpenseRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/ping")
    public String ping() {
        return "OK";
    }

    @GetMapping
    public List<Expense> getAll(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return repo.findByUserIdOrderByCreatedAtDesc(userId);
        }

        return repo.findAll();
    }

    @PostMapping
    public Expense add(@RequestParam(required = false) Long userId, @RequestBody Expense expense) {
        if (userId != null) {
            expense.setUserId(userId);
        }

        return repo.save(expense);
    }

    @PutMapping("/{id}")
    public Expense update(
        @PathVariable Long id,
        @RequestParam(required = false) Long userId,
        @RequestBody Expense updated
    ) {
        Expense exp = findExpense(id, userId);

        exp.setAmount(updated.getAmount());
        exp.setCategory(updated.getCategory());
        if (updated.getCreatedAt() != null) {
            exp.setCreatedAt(updated.getCreatedAt());
        }

        return repo.save(exp);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestParam(required = false) Long userId) {
        repo.delete(findExpense(id, userId));
    }

    private Expense findExpense(Long id, Long userId) {
        if (userId != null) {
            return repo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        }

        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
